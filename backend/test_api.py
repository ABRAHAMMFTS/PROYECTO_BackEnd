import urllib.request
import json
import uuid

def test_api_registration():
    url = "https://backend-fastapi-8uxl.onrender.com/usuarios/"
    payload = {
        "correo": f"api_test_{uuid.uuid4().hex[:6]}@test.com",
        "nomUsu": "API Test User",
        "edad": 22,
        "sexo": "M",
        "municipio": "cartagena",
        "telefono": "3001234567",
        "contrasenha": "password123"
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            print(f"Response Body: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(f"Body: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api_registration()
