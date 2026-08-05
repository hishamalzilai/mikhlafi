export function getValidationErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'issues' in err) {
    const issues = (err as { issues?: { message: string }[] }).issues;
    if (issues?.[0]?.message) return issues[0].message;
  }
  if (err instanceof Error) return err.message;
  return 'Invalid request';
}
