import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { createUserRequest, fetchUsers, updateUserRoleRequest } from '../api/users';
import { Role, User } from '../types';

const defaultForm = { name: '', email: '', password: '', role: 'OPERATOR' as Role };

export const ManageUsers = () => {
  const [form, setForm] = useState(defaultForm);
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      setForm(defaultForm);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: Role }) => updateUserRoleRequest(id, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  const handleRoleChange = (user: User, role: Role) => {
    if (user.role !== role) {
      updateRoleMutation.mutate({ id: user.id, role });
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2>Usuarios</h2>
          <p className="muted">Crea nuevos usuarios y gestiona roles</p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Nombre</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ana Pérez"
            />
          </label>
          <label>
            <span>Correo</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ana@empresa.com"
            />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 caracteres"
            />
          </label>
          <label>
            <span>Rol</span>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              <option value="ADMIN">Admin</option>
              <option value="OPERATOR">Operario</option>
            </select>
          </label>
        </div>
        <button className="primary" type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creando...' : 'Crear usuario'}
        </button>
        {createMutation.error && (
          <p className="error">No se pudo crear: {(createMutation.error as Error).message}</p>
        )}
      </form>

      <div className="table-wrapper">
        {isLoading && <p>Cargando usuarios...</p>}
        {error && <p className="error">No se pudo cargar la lista.</p>}
        {users && users.length === 0 && <p>No hay usuarios registrados.</p>}
        {users && users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                      disabled={updateRoleMutation.isPending}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="OPERATOR">Operario</option>
                    </select>
                  </td>
                  <td>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
