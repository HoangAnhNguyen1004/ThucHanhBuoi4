import { request } from './client';

export const getAll = () =>
    request('GET', '/grades?_expand=course');

export const getById = id =>
    request('GET', `/grades/${encodeURIComponent(id)}?_expand=course`);

export const update = (id, data) =>
    request('PATCH', `/grades/${encodeURIComponent(id)}`, data);

export const create = data => request('POST', '/grades', data);