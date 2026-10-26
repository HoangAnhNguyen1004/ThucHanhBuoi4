import { request } from './client';

export const getAll = () => request('GET', '/students');

export const getById = id =>
    request('GET', `/students/${encodeURIComponent(id)}`);

export const update = (id, data) =>
    request('PATCH', `/students/${encodeURIComponent(id)}`, data);

export const create = data => request('POST', '/students', data);