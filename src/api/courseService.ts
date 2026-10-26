import { request } from './client';

export const getAll = () => request('GET', '/courses');

export const getById = id =>
    request('GET', `/courses/${encodeURIComponent(id)}`);

export const update = (id, data) =>
    request('PATCH', `/courses/${encodeURIComponent(id)}`, data);

export const create = data => request('POST', '/courses', data);