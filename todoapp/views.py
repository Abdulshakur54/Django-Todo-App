from django.shortcuts import render, redirect
from .models import Todo
from .forms import TodoForm
from django.http import  JsonResponse
from django.middleware.csrf import get_token
import json
# Create your views here.

def index(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        todoForm = TodoForm(data)
        if todoForm.is_valid():
            cd = todoForm.cleaned_data
            print(cd)
            todo = Todo(title = cd['title'], completed = False)
            todo.save()
            print(todo)
            response = {
                "csrfmiddlewaretoken": get_token(request),
                "id": todo.id,
                "title": todo.title,
            }
            return JsonResponse(response, status=200)
        else:
            return JsonResponse(todoForm.errors, status=400)
    else:
        todos = Todo.objects.all()
        context = {
            'todos': todos
        }
        return render(request, 'index.html', context)
    
def modifyTodo(request, id):
    todo = Todo.objects.get(id=id)
    if request.method == 'DELETE':
        todo.delete()
    elif request.method == 'PATCH':
        todo.completed = True
        todo.save()
    response = {
        "csrfmiddlewaretoken": get_token(request),
        "id": id
    }
    return JsonResponse(response, status=200)

