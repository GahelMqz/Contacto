import { configure } from 'vee-validate'
import * as yup from 'yup'

export const validationComments = yup.object({
  comment: yup.string().required('El comentario es requerido'),
})

export const validationPosts = yup.object({
  title_post: yup.string().required('El título de la publicación es requerido'),
  body: yup.string().required('El cuerpo de la publicación es requerido'),
})

export const validationCategories = yup.object({
  title_category: yup.string().required('El nombre de la categoría es requerido'),
  img_category: yup.string().required('La imagen de la categoría es requerida'),
})

export const validationTags = yup.object({
  name_tag: yup
    .string()
    .required('La etiqueta debe de tener el carácter "#"')
    .min(2, 'La etiquete debe de tener un nombre'),
})

export const validationRoles = yup.object({
  name_rol: yup.string().required('El nombre del rol es requerido'),
})

export const validationContactForm = yup.object({
  fullName: yup.string().required('Campo requerido').min(3, 'Se requieren al menos 3 caracteres'),
  email: yup
    .string()
    .required('Campo requerido')
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Se requiere un formato válido como "usuario@dominio.com"',
    ),
  phone: yup
    .string()
    .required('Campo requerido')
    .matches(
      /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{5,6}$/,
      'Número telefónico inválido',
    ),

  msg: yup
    .string()
    .required('No olvides escribir tu mensaje')
    .min(5, 'Se requieren al menos 5 caracteres'),
})

export const validationUserRegister = yup.object({
  fullName: yup.string().required('Campo requerido'),
  email: yup
    .string()
    .required('Campo requerido')
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Se requiere un formato válido como "usuario@dominio.com"',
    ),
  password: yup.string().required('Campo requerido').min(8, 'Se requieren al menos 8 caracteres'),
})

export const validationUserLogin = yup.object({
  email: yup
    .string()
    .required('Campo requerido')
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Se requiere un formato válido como "usuario@dominio.com"',
    ),
  password: yup.string().required('Campo requerido').min(8, 'Se requieren al menos 8 caracteres'),
})

configure({
  validateOnInput: true,
})
