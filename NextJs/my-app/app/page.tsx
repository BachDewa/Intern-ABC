'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Task {
  text: string;
  id: number;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [completedTaskId, setCompletedTaskId] = useState<number | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTask.trim() !== '') {
      if (editingTaskId !== null) {
        setTasks(tasks.map(task => (task.id === editingTaskId ? { ...task, text: newTask } : task)));
        setEditingTaskId(null);
      } else {
        setTasks([...tasks, { text: newTask, id: Date.now() }]);
      }
      setNewTask('');
    }
  };

  const handleDelete = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEdit = (taskId: number) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setNewTask(taskToEdit.text);
      setEditingTaskId(taskId);
    }
  };

  const handleCheckboxChange = (taskId: number) => {
    // Xác định công việc đã hoàn thành và hiển thị thông báo
    setCompletedTaskId(taskId);

    // Xóa công việc sau 2 giây
    setTimeout(() => {
      setCompletedTaskId(null);
      setTasks(tasks.filter(task => task.id !== taskId));
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-20">
      <h2 className="text-2xl font-semibold mb-4">TO DO LIST</h2>
      <form className="flex items-center mb-4 space-x-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New job"
          value={newTask}
          onChange={handleInputChange}
          className="px-4 py-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        />
        <button
          type="submit"
          className={`${
            editingTaskId !== null ? 'bg-yellow-500' : 'bg-indigo-600'
          } text-white px-1 py-1 rounded-md`}
        >
          {editingTaskId !== null ? 'Update' : 'Create'}
        </button>
      </form>
      
      {tasks.length > 0 && (
        <table className="w-3/5">
          <thead>
            <tr>
              <th className="flex-none w-14 h-14">Complete</th>
              <th className="flex-none w-14 h-14">Task</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-t border-gray-300">
                <td className="py-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={() => handleCheckboxChange(task.id)}
                  />
                </td>
                <td className="py-2">{task.text}</td>
                <td className="py-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="text-blue-500"
                  >
                    ✏️Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600"
                  >
                    🗑️Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {completedTaskId !== null && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
          Congratulations! You've completed a task.
        </div>
      )}
    </main>
  );
}
