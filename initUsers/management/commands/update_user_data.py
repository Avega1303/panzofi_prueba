from django.core.management.base import BaseCommand
from initUsers.models import UserProfile
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Genera y actualiza datos aleatorios para los usuarios'

    def get_random_date(self):
        start_date = datetime(2025, 1, 7)
        end_date = datetime.today()
        time_delta = end_date - start_date
        random_days = random.randint(0, time_delta.days)
        return start_date + timedelta(days=random_days)

    def get_random_session_time(self):
        return random.randint(0, 3600)

    def get_random_button_value(self):
        return random.randint(0, 400)

    def handle(self, *args, **kwargs):
        users = UserProfile.objects.all()

        for user in users:
            user.last_session_date = self.get_random_date()
            user.session_time = self.get_random_session_time()
            user.variableB1 = self.get_random_button_value()
            user.variableB2 = self.get_random_button_value()
            user.save()

        self.stdout.write(self.style.SUCCESS('Datos de los usuarios actualizados exitosamente.'))