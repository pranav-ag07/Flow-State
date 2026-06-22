import CountdownTimer from '../components/CountdownTimer';

const TARGET_DATE = new Date('2026-09-30T17:13:00+05:30');
const SYLLABUS_DATE = new Date('2026-08-11T17:13:00+05:30');

export default function HomePage() {
  return (
    <CountdownTimer targetDate={TARGET_DATE} syllabusDate={SYLLABUS_DATE} />
  );
}
