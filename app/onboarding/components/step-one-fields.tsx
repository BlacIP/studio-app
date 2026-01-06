import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StepOneFields({
  studioName,
  onStudioNameChange,
}: {
  studioName: string;
  onStudioNameChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="studioName">Studio name</Label>
        <Input
          id="studioName"
          value={studioName}
          onChange={(e) => onStudioNameChange(e.target.value)}
          placeholder="Lumiere Portraits"
          required
        />
      </div>
    </div>
  );
}
