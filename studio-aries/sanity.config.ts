import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Aries',

  projectId: '26wq1wsf',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  api: {
    cors: {
      allowOrigins: ['http://localhost:3001', 'http://localhost:5173'],
      allowCredentials: true,
    },
  },
})