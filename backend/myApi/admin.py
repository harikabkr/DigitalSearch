from django.db.models.signals import post_save, post_init
from django.contrib import admin
from django.dispatch import receiver
from myApi.models import User, Profile
from django.conf import settings
from .utils import Util

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_editable=['is_active']
    list_display = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'is_active', 'is_staff', 'is_verified', 'is_superuser', 'qr_code', 'otp_created_at']

class ProfileAdmin(admin.ModelAdmin):
    # list_editable=['verified']
    list_editable = ['full_name']
    list_display = ['user', 'full_name']   #email = models.EmailField(unique=True)

@receiver(post_init, sender=User)
def remember_previous_active_status(sender, instance, **kwargs):
    instance.previous_is_active = instance.is_active
    # print('post_init', instance)
    # print('post_init is_active', instance.is_active)

@receiver(post_save, sender=User)
def create_user_api_key(sender, instance, created, update_fields, **kwargs):
    if not created:
        # print('post save', instance)
        # print('Fields to Update', update_fields)
        # print('post_save is_active',instance.is_active)
        if instance.previous_is_active != instance.is_active:
            data = {}
            if instance.is_active:
                print('> User Approved. Previous State: ',instance.previous_is_active, 'Updated State: ', instance.is_active)
                userQrCode = settings.REACT_URI+settings.MEDIA_URL + str(instance.qr_code)
                email_body = 'Hi '+instance.username+', \n\n Thanks for registering to Digital Library.\n Your registration is approved by admin.\n You can now use your credentials to login.\n Please use link below to add an authenticater for getting OTP. \n'+userQrCode
                data = {'subject': 'Registaration Approved', 'email_body': email_body, 'to_email': instance.email }
            else:
                print('> User Deactivated. Previous State: ',instance.previous_is_active, 'Updated State: ', instance.is_active)
                email_body = 'Hi '+instance.username+', \n\n Your Digital Library account has been deactivated.\n Please reach out to admin to reactivate the account.\n' 
                data = {'subject': 'Account Deactivated', 'email_body': email_body, 'to_email': instance.email }
            # trigger email with status active and qrcode.
            Util.send_email(data)


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)

