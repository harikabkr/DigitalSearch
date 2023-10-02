from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, include
from myApi import views
from myApi.views import CreateUserView, VerityOTPView, LoginView, VerifyEmail, RequestPasswordResetEmail, PasswordTokenCheckAPI, SetNewPasswordApiView, UpdatePasswordPairView, UpdateProfileView, GetProfileView, LogoutView

urlpatterns = [

    path("token/", views.ObtainTokenPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("login/", LoginView.as_view()),
    # path("register/", views.ObtainRegisterTokenView.as_view()),
    path("register/", CreateUserView.as_view()),
    path("dashboard/", views.dashboard),
    path('change-password/<pk>/', UpdatePasswordPairView.as_view(), name='change-password'),
    path("verity-otp/", VerityOTPView.as_view()),
    path("email-verify/", VerifyEmail.as_view(), name='email-verify'),
    path('request-reset-email', RequestPasswordResetEmail.as_view(), name='request-reset-email'),
    path('password-reset/<uidb64>/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete', SetNewPasswordApiView.as_view(), name='password-reset-complete'),
    path('update-profile/<pk>/', UpdateProfileView.as_view(), name='update-profile'),
    path('get-profile/<pk>/', GetProfileView.as_view(), name='get-profile'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]