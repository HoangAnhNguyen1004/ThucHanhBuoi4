import { request } from './client';

export const getAll = () =>
    request('GET', '/assignments?_expand=course&_sort=dueDate&_order=asc');

export const getById = id =>
    request('GET', `/assignments/${encodeURIComponent(id)}?_expand=course`);

export const update = (id, data) =>
    request('PATCH', `/assignments/${encodeURIComponent(id)}`, data);

export const create = data => request('POST', '/assignments', data);