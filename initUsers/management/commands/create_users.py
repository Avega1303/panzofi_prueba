from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker

class Command(BaseCommand):
    help = 'Crea 35 usuarios de manera automática'

    def handle(self, *args, **kwargs):
        fake = Faker()
        users_created = 0

        with open('user_passwords.txt', 'w') as output_file:
            # Solo crea usuarios si no existen
            for _ in range(35):
                username = fake.user_name()
                password = fake.password()
                user = User.objects.filter(username=username).first()

                # Si no existe el usuario, lo creamos
                if not user:
                    user = User.objects.create_user(username=username, password=password)
                    output_file.write(f'Username: {username}, Password: {password}\n')  # Guarda las credenciales
                    users_created += 1

        self.stdout.write(self.style.SUCCESS(f'{users_created} usuarios creados exitosamente.'))