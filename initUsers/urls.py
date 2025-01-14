from django.urls import path, include
from rest_framework import routers
from initUsers import views

router=routers.DefaultRouter()
router.register(r'users', views.UserProfileListView,'userprofile')

urlpatterns = [
    path('api/userlist/', include(router.urls)),
    path('api/login/', views.login_view, name='login'),
    path('api/buttonclick/<int:button_id>/', views.clickcount, name='buttonclick'),
    path('api/updatesession/', views.updatesession, name='updatesession'),
    path('api/updatetime/', views.updatetime, name='updatetime'),
    path('api/logout/', views.logout_view, name='logout'),
]