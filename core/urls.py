from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('userprofile/',include('initUsers.urls')),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
