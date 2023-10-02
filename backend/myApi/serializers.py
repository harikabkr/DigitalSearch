# from asyncio import exceptions
from datetime import datetime as dt
from io import BytesIO
import pyotp 
import qrcode

from myApi.models import User, Profile

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.files.base import ContentFile
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

from .utils import Util




class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ["id", "email", "password", "password2", "qr_code", "username"]

        extra_kwargs = {
            "password": {"write_only": True},
            "qr_code": {"read_only": True},
        }
    
    def validate(self, attrs: dict):
        email = attrs.get("email").lower().strip()
        if get_user_model().objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Email already exists!"})
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields does not match"}
            )
        return attrs
        # return super().validate(attrs)

    def create(self, validated_data: dict):
        otp_base32 = pyotp.random_base32()
        print('validated data: ', validated_data)
        email = validated_data.get("email")
        otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
            name=email.lower(), issuer_name="Harika Vejendla"
        )
        username = validated_data.get("username")
        stream = BytesIO()
        image = qrcode.make(f"{otp_auth_url}")
        image.save(stream)
        user_info = {
            "email": validated_data.get("email"),
            "password": make_password(validated_data.get("password")),
            "username": username,
            "otp_base32": otp_base32,
        }
        print('Register User Info | ', user_info)
        user: User = get_user_model().objects.create(**user_info)
        user.qr_code = ContentFile(
            stream.getvalue(), name=f"qr{get_random_string(10)}.png"
        )
        user.save()

        return user

class UpdateUserSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    # def validate_email(self, value):
    #     user = self.context['request'].user
    #     if User.objects.exclude(pk=user.pk).filter(email=value).exists():
    #         raise serializers.ValidationError({"email": "This email is already in use."})
    #     return value

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        # instance.email = validated_data['email']
        instance.username = validated_data['username']
        instance.save()
        return instance


# Create Token when user and password has been provided
class ObtainTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)

        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)
        token['verified'] = user.profile.verified

        return token


class ObtainRegisterTokenSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields does not match"}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user
        

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    previous_password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['password', 'previous_password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match"})
        return attrs

    def validate_previous_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"previous_password": "Incorrect password"})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user is not None:
            user.set_password(validated_data['password'])
            user.save()
            return user
        return instance


class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']
    
    def validate(self, attrs):
        return super().validate(attrs)


class SetNewPasswordApiSerializer(serializers.Serializer):
    password=serializers.CharField(min_length=6, max_length=68, write_only=True)
    token=serializers.CharField(min_length=1, write_only=True)
    uidb64=serializers.CharField(min_length=1, max_length=68, write_only=True)

    class Meta:
        fields=['password','token','uidb64']

    def validate(self, attrs):
        try:
            password=attrs.get('password')
            token=attrs.get('token')
            uidb64=attrs.get('uidb64')
            id= force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise exceptions.AuthenticationFailed('The Reset Link is invalid', 401)
            
            # set new password
            user.set_password(password)
            user.save()
            
            return (user)

        except Exception as e:
            raise exceptions.AuthenticationFailed('The Reset Link is invalid', 401)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs: dict):
        email = attrs.get("email").lower().strip()
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=attrs.get("password"),
        )
        if user is None:
            raise exceptions.AuthenticationFailed("Invalid login details.")
        else:
            attrs["user_object"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        totp = pyotp.TOTP(user.otp_base32).now()
        print("testing", totp)
        user.login_otp = make_password(totp)
        print("testing", user.login_otp)
        user.otp_created_at = dt.now(timezone.utc)
        user.login_otp_used = False
        user.save(update_fields=["login_otp", "otp_created_at", "login_otp_used"])
        return user


class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField()
    user_id = serializers.UUIDField()

    def validate(self, attrs: dict):
        user: User = User.objects.filter(id=attrs.get("user_id")).first()
        print('> User Identified', user)
        if not user:
            raise exceptions.AuthenticationFailed("Authentication Failed.")
        # if user.login_otp != attrs.get("otp") or not user.is_valid_otp():
        print('> User login_otp', user.login_otp)
        print('> User otp', attrs.get("otp"))
        print('> check password', check_password(attrs.get("otp"), user.login_otp))
        print('> User is valid otp', user.is_valid_otp())
        if (
            not check_password(attrs.get("otp"), user.login_otp)
            or not user.is_valid_otp()
        ):
            raise exceptions.AuthenticationFailed("Authentication Failed.")
        attrs["user"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user")
        refresh = RefreshToken.for_user(user)
        user.login_otp_used = True
        user.save(update_fields=["login_otp_used"])
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }