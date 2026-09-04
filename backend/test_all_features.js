const API = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING COMPLETE BACKEND TESTS ===\n');
  const timestamp = Date.now();
  const testUser = {
    name: 'MERN Tester',
    email: `tester_${timestamp}@example.com`,
    password: 'password123'
  };

  try {
    // 1. Validation error test - invalid registration
    console.log('Test 1: Validation middleware rejection for short password');
    const failReg = await fetch(`${API}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'T',
        email: 'invalid-email',
        password: '123'
      })
    });
    const failRegData = await failReg.json();
    if (failReg.status === 400 && failRegData.errors?.length > 0) {
      console.log('✅ Passed: 400 with validation errors:', failRegData.errors);
    } else {
      console.error('❌ Failed: Unexpected response:', failReg.status, failRegData);
      process.exit(1);
    }

    // 2. Register valid user
    console.log('\nTest 2: Valid User Registration');
    const regRes = await fetch(`${API}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    if (regRes.status === 201 && regData.token) {
      console.log('✅ Passed: User registered, token received:', !!regData.token, 'userId:', regData.userId);
    } else {
      console.error('❌ Failed to register:', regRes.status, regData);
      process.exit(1);
    }
    const token = regData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 3. User Login
    console.log('\nTest 3: User Login');
    const loginRes = await fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const loginData = await loginRes.json();
    if (loginRes.status === 200 && loginData.token) {
      console.log('✅ Passed: User logged in, token received:', !!loginData.token);
    } else {
      console.error('❌ Failed to login:', loginRes.status, loginData);
      process.exit(1);
    }

    // 4. GET /api/users/me (Protected)
    console.log('\nTest 4: GET /api/users/me');
    const meRes = await fetch(`${API}/users/me`, { headers: authHeaders });
    const meData = await meRes.json();
    if (meRes.status === 200 && meData.email === testUser.email) {
      console.log('✅ Passed: Profile fetched for:', meData.name, meData.email);
    } else {
      console.error('❌ Failed to get profile:', meRes.status, meData);
      process.exit(1);
    }

    // 5. Create Task with priority and due date
    console.log('\nTest 5: Create Task with priority and due date');
    const task1Res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Task Alpha - High Priority',
        description: 'First test task description',
        priority: 'high',
        dueDate: '2026-12-31'
      })
    });
    const task1 = await task1Res.json();
    if (task1Res.status === 201 && task1.priority === 'high') {
      console.log('✅ Passed: Task created with ID:', task1._id, 'priority:', task1.priority);
    } else {
      console.error('❌ Failed to create task:', task1Res.status, task1);
      process.exit(1);
    }

    // 6. Create another task (medium priority)
    const task2Res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Task Beta - Medium Priority',
        description: 'Second test task',
        priority: 'medium'
      })
    });
    const task2 = await task2Res.json();
    if (task2Res.status === 201) {
      console.log('✅ Passed: Second task created with ID:', task2._id);
    } else {
      console.error('❌ Failed to create second task:', task2Res.status, task2);
      process.exit(1);
    }

    // 7. GET all tasks
    console.log('\nTest 6: GET all user tasks');
    const allTasksRes = await fetch(`${API}/tasks`, { headers: authHeaders });
    const allTasks = await allTasksRes.json();
    if (allTasksRes.status === 200 && Array.isArray(allTasks) && allTasks.length >= 2) {
      console.log(`✅ Passed: Fetched ${allTasks.length} tasks`);
    } else {
      console.error('❌ Failed to get tasks:', allTasksRes.status, allTasks);
      process.exit(1);
    }

    // 8. GET single task by ID
    console.log('\nTest 7: GET single task by ID');
    const singleTaskRes = await fetch(`${API}/tasks/${task1._id}`, { headers: authHeaders });
    const singleTask = await singleTaskRes.json();
    if (singleTaskRes.status === 200 && singleTask.title === task1.title) {
      console.log('✅ Passed: Fetched single task title:', singleTask.title);
    } else {
      console.error('❌ Failed to get single task:', singleTaskRes.status, singleTask);
      process.exit(1);
    }

    // 9. Update task
    console.log('\nTest 8: Update task');
    const updateRes = await fetch(`${API}/tasks/${task1._id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Task Alpha - Updated',
        priority: 'low',
        status: 'in-progress'
      })
    });
    const updatedTask = await updateRes.json();
    if (updateRes.status === 200 && updatedTask.priority === 'low' && updatedTask.status === 'in-progress') {
      console.log('✅ Passed: Task updated status:', updatedTask.status, 'priority:', updatedTask.priority);
    } else {
      console.error('❌ Failed to update task:', updateRes.status, updatedTask);
      process.exit(1);
    }

    // 10. Toggle task completion
    console.log('\nTest 9: Toggle task completion');
    const toggleRes = await fetch(`${API}/tasks/${task2._id}/toggle`, {
      method: 'PUT',
      headers: authHeaders
    });
    const toggledTask = await toggleRes.json();
    if (toggleRes.status === 200 && toggledTask.completed === true && toggledTask.status === 'completed') {
      console.log('✅ Passed: Toggled completed:', toggledTask.completed, 'status:', toggledTask.status);
    } else {
      console.error('❌ Failed to toggle task:', toggleRes.status, toggledTask);
      process.exit(1);
    }

    // 11. Delete completed tasks
    console.log('\nTest 10: Delete completed tasks');
    const deleteCompRes = await fetch(`${API}/tasks/completed`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const deleteCompData = await deleteCompRes.json();
    if (deleteCompRes.status === 200) {
      console.log('✅ Passed: Delete completed result:', deleteCompData.message);
    } else {
      console.error('❌ Failed to delete completed tasks:', deleteCompRes.status, deleteCompData);
      process.exit(1);
    }

    // 12. Delete single task
    console.log('\nTest 11: Delete single task');
    const deleteSingleRes = await fetch(`${API}/tasks/${task1._id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const deleteSingleData = await deleteSingleRes.json();
    if (deleteSingleRes.status === 200) {
      console.log('✅ Passed: Delete single result:', deleteSingleData.message);
    } else {
      console.error('❌ Failed to delete single task:', deleteSingleRes.status, deleteSingleData);
      process.exit(1);
    }

    // 13. 404 test for non-existent route
    console.log('\nTest 12: 404 handler for undefined route');
    const notFoundRes = await fetch(`${API}/non-existent-route`);
    const notFoundData = await notFoundRes.json();
    if (notFoundRes.status === 404) {
      console.log('✅ Passed: 404 received with message:', notFoundData.message);
    } else {
      console.error('❌ Failed: Expected 404, got:', notFoundRes.status);
      process.exit(1);
    }

    console.log('\n🎉 ALL 12 BACKEND TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error) {
    console.error('❌ Unexpected test error:', error);
    process.exit(1);
  }
}

runTests();
