import { Timeline, Bootcamp } from "./Timeline";

export function BootcampList({ items }: { items: Bootcamp[] }) {
  return <Timeline items={items} type="bootcamp" />;
}

