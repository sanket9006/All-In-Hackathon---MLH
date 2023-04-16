import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from user.models import User
from poll.models import Poll, Choice
from django.http import QueryDict
import json


@csrf_exempt
def create_poll(request):
    if request.method == 'POST':
        # Get IP address from request
        data = request.body
        data_dict = json.loads(data)

        ip_address = request.META.get(
            'HTTP_X_FORWARDED_FOR', '') or request.META.get('REMOTE_ADDR')
        # Try to get user with given IP address
        user = User.objects.filter(ip_address=ip_address).first()

        # If user does not exist, create a new one
        if user is None:
            user = User.objects.create(ip_address=ip_address)

        # Get poll data from request
        title = data_dict.get('title', '')
        choices = data_dict.get('choices', [])
        print(choices)
        # Create new poll with a unique reference link
        ref_link = str(uuid.uuid4().int)[0:16]
        poll = Poll.objects.create(
            title=title, user=user, created_at=timezone.now(), reference_link=ref_link)

        # Create choice objects
        if choices:
            for choice_text in choices:
                text = choice_text.get('text', '')
                print(text)
                choice = Choice.objects.create(
                    poll=poll,
                    choice_text=text,
                    votes=0,
                )

        # Return JSON response with poll data and reference link
        response_data = {
            'success': True,
            'data': {
                'id': poll.id,
                'title': poll.title,
                'user_ip': user.ip_address,
                'created_at': poll.created_at.isoformat(),
                'reference_link': poll.reference_link,
            }
        }
        return JsonResponse(response_data)

    # Handle non-POST requests
    response_data = {
        'success': False,
        'data': {
            'error': 'Invalid request method',
        }
    }
    return JsonResponse(response_data)


@csrf_exempt
def view_poll(request):
    if request.method == 'GET':
        # Get reference link from request
        reference_link = request.GET.get('reference_link', '')

        # Try to get poll with given reference link
        poll = Poll.objects.filter(reference_link=reference_link).first()

        # If poll does not exist, return an error response
        if poll is None:
            response_data = {
                'success': False,
                'data': {
                    'error': 'Poll not found',
                }
            }
            return JsonResponse(response_data)

        # Get choices of the poll
        choices = Choice.objects.filter(poll=poll)

        # Prepare JSON response
        response_data = {
            'success': True,
            'data': {
                'id': poll.id,
                'title': poll.title,
                'user_ip': poll.user.ip_address,
                'created_at': poll.created_at.isoformat(),
                'reference_link': poll.reference_link,
                'choices': [
                    {
                        'id': choice.id,
                        'text': choice.choice_text,
                        'votes': choice.votes,
                    }
                    for choice in choices
                ]
            }
        }

        # Return JSON response
        return JsonResponse(response_data)

    # Handle non-GET requests
    response_data = {
        'success': False,
        'data': {
            'error': 'Invalid request method',
        }
    }
    return JsonResponse(response_data)
