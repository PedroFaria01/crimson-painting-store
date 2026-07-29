-- Links orders to the signed-in customer who placed them (nullable — guest
-- checkout has no account, so no user_id) and lets that customer read their
-- own order history, on top of the existing admin-only access.

alter table orders add column user_id uuid references auth.users(id) on delete set null;
create index orders_user_id_idx on orders(user_id);

create policy "orders_owner_read" on orders
  for select using (user_id = auth.uid());

create policy "order_items_owner_read" on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
