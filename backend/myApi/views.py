from uuid import UUID
from django.shortcuts import render

from myApi.models import Profile, User
from myApi.serializers import UserSerializer, UpdateUserSerializer, ObtainTokenSerializer, ObtainRegisterTokenSerializer, ChangePasswordSerializer, LoginSerializer, VerifyOTPSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordApiSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.urls import reverse
import jwt
from django.conf import settings
from rest_framework import exceptions, serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

from .utils import Util

# Create your views here.


class ObtainTokenPairView(TokenObtainPairView):
    serializer_class = ObtainTokenSerializer


class ObtainRegisterTokenView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = ObtainRegisterTokenSerializer


class UpdatePasswordPairView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = ChangePasswordSerializer


class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=request.data)
        email = request.data['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.filter(email=email).first()
            print('> User Found: ', user.id.hex)
            uidb64 = urlsafe_base64_encode(user.id.hex.encode())
            token = PasswordResetTokenGenerator().make_token(user)  # specific to user
            relativeLink = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            # current_site = get_current_site(request=request).domain
            absoluteUrl = settings.REACT_URI+relativeLink
            email_body = 'Hello '+user.username + \
                ' \n Please use below link below to reset your password. \n'+absoluteUrl
            data = {'subject': 'Reset your password',
                    'email_body': email_body, 'to_email': user.email}
            Util.send_email(data)
            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        return Response({'error': 'No user found with matching email'}, status=status.HTTP_404_NOT_FOUND)
#


class PasswordTokenCheckAPI(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

            return Response({'success': True, 'message': 'Credentials Valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError as identifier:
            return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)


class SetNewPasswordApiView(generics.GenericAPIView):
    serializer_class = SetNewPasswordApiSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)


class CreateUserView(generics.GenericAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def post(self, request, format=None):
        print('Create User Serializer View, ', request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Send a confirmation email to user
        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verify')
        absoluteUrl = 'http://'+current_site+relativeLink+'?token='+str(token)
        email_body = 'Hi '+user.username + \
            ' \n Thanks for registering to Digital Library.\n Please use link below to verify your email. \n'+absoluteUrl
        data = {'subject': 'Verify your email',
                'email_body': email_body, 'to_email': user.email}
        Util.send_email(data)
        return Response(
            {"qr_code": user.qr_code.url, "success": True, "message": "Registration Successful!"}, status=200
        )


class VerifyEmail(generics.GenericAPIView):
    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=['HS256'])
            print('> Verify Email Payload:', payload)
            user = User.objects.get(id=payload['user_id'])
            print('> Verify Email user:', user)
            if not user:
                raise exceptions.AuthenticationFailed('User Not Found')
            if not user.is_verified:
                user.is_verified = True
                user.save()
                userQrCode = settings.MEDIA_URL + str(user.qr_code)
                return Response({'message': 'email verified successfully.', 'qr_code_url': userQrCode}, status=status.HTTP_200_OK)
            return Response({'message': 'User email already verified.'}, status=status.HTTP_400_BAD_REQUEST)

        except jwt.ExpiredSignatureError as identifier:
            print(identifier)
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            print(identifier)
            return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(generics.GenericAPIView):
    """Login with email and password"""

    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": True,
                "user": user.id,
                "qr_code": user.qr_code.url,
                "message": "Login Successful. Proceed to 2FA",
            },
            status=200,
        )


class VerityOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info: dict = serializer.save()
        return Response(login_info, status=200)


class UpdateProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateUserSerializer

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            userProfile = {}
            userProfile['first_name'] = user.first_name
            userProfile['last_name'] = user.last_name
            userProfile['username'] = user.username
            userProfile['email'] = user.email
            userProfile['is_verified'] = user.is_verified
            userProfile['qr_code'] = smart_str(user.qr_code)
            print('> Retrieve Profile', userProfile)
            return Response(userProfile, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_BAD_REQUEST)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == "GET":
        response = f"Hi {request.user}, you  got response for your get request"
        return Response({'response': response}, status=status.HTTP_200_OK)
    elif request.method == "POST":
        text = request.POST.get("text")
        response = f"Hi {request.user}, your response for POST request"
        return Response({'response': response}, status=status.HTTP_200_OK)
    return Response({'response': response}, status=status.HTTP_400_BAD_REQUEST)


