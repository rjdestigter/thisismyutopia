import * as React from 'react'

export type propsInput = {
    onChange: (value: string) => void;
} & Omit<JSX.IntrinsicElements['input'], | 'onChange'>

export const Input = (props: propsInput) => {
    return (
        <input type={'text'} {...props} onChange={evt => props.onChange(evt.currentTarget.value)} />
    )
}

export const Email = (props: Omit<propsInput, 'type'>) => <Input {...props} type='email' />


export const Password = (props: Omit<propsInput, 'type'>) => <Input {...props} type='password' />