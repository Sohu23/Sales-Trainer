export const UNLOCK_REQUIREMENTS = {
  level2: { prevLevel: 1, distinctScenarios: 2 },
  level3: { prevLevel: 2, distinctScenarios: 2 },
} as const;

export function rubricAvg(r: {
  pitch: number;
  discovery: number;
  objections: number;
  closing: number;
  tone: number;
}) {
  return (r.pitch + r.discovery + r.objections + r.closing + r.tone) / 5;
}

export function isPassedRubric(r: {
  pitch: number;
  discovery: number;
  objections: number;
  closing: number;
  tone: number;
}) {
  return rubricAvg(r) >= 3.5 && r.closing >= 3;
}
