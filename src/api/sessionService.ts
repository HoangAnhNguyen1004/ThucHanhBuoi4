import { request } from './client';

export const getAll = () =>
    request('GET', '/sessions?_expand=course');

export const getById = id =>
    request('GET', `/sessions/${encodeURIComponent(id)}?_expand=course`);

export const update = (id, data) =>
    request('PATCH', `/sessions/${encodeURIComponent(id)}`, data);

export const create = data => request('POST', '/sessions', data);