from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db.models.signals import post_save, pre_save
from django.utils import timezone
import uuid
# from .managers import CustomUserManager

class UserManager(BaseUserManager):

    def create_user(self, username, email, password=None):
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None):
        if password is None:
            raise TypeError('Password should not be none')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length= 100)
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # email = models.EmailField(unique=True)
    # otp = models.CharField(max_length=6, null=True, blank=True)
    # qr_code = models.FileField(upload_to="qr/", blank=True, null=True)
    # otpauth_url = models.CharField(max_length=225, blank=True, null=True)
    # otp_base32 = models.CharField(max_length=255, null=True)
    # qr_code = models.ImageField(upload_to="qrcode/",blank=True, null=True)
    # login_otp = models.CharField(max_length=255, null=True, blank=True)
    # login_otp_used = models.BooleanField(default=True)
    # otp_created_at = models.DateTimeField(blank=True, null=True)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # email = models.EmailField(("email address"), null=True, blank=True, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    # is_admin = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)
    # objects = CustomUserManager()
    otpauth_url = models.CharField(max_length=225, blank=True, null=True)
    otp_base32 = models.CharField(max_length=255, null=True)
    qr_code = models.ImageField(upload_to="qrcode/",blank=True, null=True)
    login_otp = models.CharField(max_length=255, null=True, blank=True)
    login_otp_used = models.BooleanField(default=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    
    USERNAME_FIELD = 'email'   #The USERNAME_FIELD is set to 'email', indicating that the email address is used for logging in.
    REQUIRED_FIELDS = ['username']  #Mandatory

    objects = UserManager()
    
    # class Meta:
    #     ordering = ("-created_at",)

    def __str__(self):
        return self.username
    
    def is_valid_otp(self):
        lifespan_in_seconds = 30
        now = datetime.now(timezone.utc)
        time_diff = now - self.otp_created_at
        time_diff = time_diff.total_seconds()
        print('> Validating OTP: ', time_diff)
        if time_diff >= lifespan_in_seconds or self.login_otp_used :
            return False
        return True

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    full_name = models.CharField(max_length=300)
    bio = models.CharField(max_length=300)
    image= models.ImageField(default="default.jpg", upload_to="user_images")
    verified = models.BooleanField(default=False)
    # email = models.EmailField(unique=True)

    def __str__(self):
        return self.full_name
    

def create_profile_for_User(sender, instance,created, **kwargs):
    if created:
        Profile.objects.create(user = instance)

def Save_profile_for_User(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_profile_for_User, sender=User)
post_save.connect(Save_profile_for_User, sender=User)

# def generate_reset_password_token(sender, instance, generated, **kwargs):






