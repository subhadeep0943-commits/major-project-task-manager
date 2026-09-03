fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Test Admin',
        email: 'admin@taskmanager.com',
        password: 'secure_password_123'
    })
})
.then(response => response.json())
.then(data => console.log('Server Output:', data))
.catch(error => console.error('Transmission Error:', error));