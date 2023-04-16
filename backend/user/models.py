from django.db import models

class User(models.Model):
    ip_address = models.CharField(max_length=45, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ip_address
