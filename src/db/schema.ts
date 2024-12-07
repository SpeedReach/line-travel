import { mysqlTable, varchar, tinyint, serial, int, index } from 'drizzle-orm/mysql-core';




export const hotels = mysqlTable('hotels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  webLink: varchar('webLink', { length: 255 }),
  address: varchar('address', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  status: tinyint('status').notNull(),
  coordinate: varchar('coordinate', { length: 255 }).notNull(),
  h3Index: varchar('h3Index', {length: 20}).notNull(),
}, (table) => ({
  h3Idx: index('h3_idx').on(table.h3Index)
}));