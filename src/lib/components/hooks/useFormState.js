import { useState } from 'react';

export const useFormState = initialState => {
  const [formState, setFormState] = useState(initialState);

  const onChange = event => {
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (!name) {
      throw Error('Field must have a name attribute!');
    }
    setFormState(state => ({ ...state, [name]: value }));
  };

  return [formState, onChange];
};
