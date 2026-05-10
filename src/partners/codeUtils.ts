export function buildReferralCode(firstName: string): string {
  const slug = (firstName || 'PARRAIN')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 8) || 'PARRAIN';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `AS-${slug}${num}`;
}
