import { Timeline, Experience } from "./Timeline";

export function ExperienceList({ items }: { items: Experience[] }) {
  return <Timeline items={items} type="work" />;
}

