# -*- coding: utf8 -*-
from django.shortcuts import render, render_to_response
from django.http import JsonResponse
from collections import Counter
import json

dic = [chr(x) for x in range(ord('a'), ord('z') + 1)]
dicLen = len(dic)


def encrypt(text, shift):
    return "".join([(dic[(dic.index(c) + shift) % dicLen]) if (c in dic) else c for c in text])


def decrypt(text, shift):
    return "".join([(dic[(dic.index(c) - shift) % dicLen]) if (c in dic) else c for c in text])


def findshift(text):
    highfreq = Counter(text).most_common(3)
    l = [str((ord('e') - ord(key)) * -1) if ((ord('e') - ord(key)) <= 0) else str(((ord('e') - ord(key)) * -1) + dicLen) for key, value in highfreq]
    if l[0] == '0':
        res = '0'
    else:
        res = ", ".join(l)
    return res


def index(request):
    return render(request, 'CaesarCipher/index.html')

def crypt(request):
    if request.method == 'POST' and request.is_ajax():
        js_data = json.loads(request.body.decode("utf-8"))
        msg = js_data.get('msg')
        type_ = js_data.get('type')
        shift = js_data.get('shift')
        if type_ == 'encrypt':
            res = encrypt(msg, int(shift))
        elif type_ == 'decrypt':
            res = decrypt(msg, int(shift))
        else:
            res = findshift(msg)
        return JsonResponse({'result':res})
    return JsonResponse({'msg':'error'}, status=400)
