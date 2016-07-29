const _ACTIONS = {
  ADD_REGISTRY: 'ADD_REGISTRY',
  ADD_REGISTRY_SUCCESS: 'ADD_REGISTRY_SUCCESS',
  ADD_REGISTRY_FAIL: 'ADD_REGISTRY_FAIL',
  EDIT_REGISTRY: 'EDIT_REGISTRY',
  EDIT_REGISTRY_SUCCESS: 'EDIT_REGISTRY_SUCCESS',
  EDIT_REGISTRY_FAIL: 'EDIT_REGISTRY_FAIL',
  LOAD_REGISTRIES: 'LOAD_REGISTRIES',
  LOAD_REGISTRIES_SUCCESS: 'LOAD_REGISTRIES_SUCCESS',
  LOAD_REGISTRIES_FAIL: 'LOAD_REGISTRIES_FAIL',
  REMOVE_REGISTRY: 'REMOVE_REGISTRY',
  REMOVE_REGISTRY_SUCCESS: 'REMOVE_REGISTRY_SUCCESS',
  REMOVE_REGISTRY_FAIL: 'REMOVE_REGISTRY_FAIL'
};

Object.keys(_ACTIONS).forEach((key) => {
  _ACTIONS[key] = 'registries/' + _ACTIONS[key];
});
export const ACTIONS = _ACTIONS;