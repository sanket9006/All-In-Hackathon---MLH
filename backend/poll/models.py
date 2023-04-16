import random
import string
from django.db import models
from user.models import User

def generate_reference_link():
    """Generate a random 16-digit alphanumeric string."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=16))

class Poll(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    reference_link = models.CharField(max_length=16, unique=True, default=generate_reference_link)

    def __str__(self):
        return self.title

class Choice(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text
