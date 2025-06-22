import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { Transport } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const transportStopSchema = z.object({
  name: z.string().min(2, 'Stop name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  time: z.string().min(1, 'Time is required'),
});

const transportSchema = z.object({
  routeName: z.string().min(2, 'Route name must be at least 2 characters'),
  driverName: z.string().min(2, 'Driver name must be at least 2 characters'),
  vehicleNumber: z.string().min(2, 'Vehicle number must be at least 2 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  students: z.array(z.string()),
  stops: z.array(transportStopSchema).min(1, 'At least one stop is required'),
  schedule: z.string().min(1, 'Schedule is required'),
});

type TransportFormData = z.infer<typeof transportSchema>;

interface TransportFormProps {
  transport?: Transport | null;
  onSuccess: () => void;
}

export function TransportForm({ transport, onSuccess }: TransportFormProps) {
  const { addTransport, updateTransport, students } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: transport ? {
      routeName: transport.routeName,
      driverName: transport.driverName,
      vehicleNumber: transport.vehicleNumber,
      capacity: transport.capacity,
      students: transport.students,
      stops: transport.stops.map(stop => ({
        name: stop.name,
        address: stop.address,
        time: stop.time,
      })),
      schedule: transport.schedule,
    } : {
      students: [],
      stops: [{ name: '', address: '', time: '' }],
      capacity: 30,
    },
  });

  const { fields: stopFields, append: appendStop, remove: removeStop } = useFieldArray({
    control,
    name: 'stops',
  });

  const watchedStudents = watch('students') || [];

  const onSubmit = (data: TransportFormData) => {
    const transportData = {
      ...data,
      stops: data.stops.map((stop, index) => ({
        id: `stop-${index}`,
        name: stop.name,
        address: stop.address,
        time: stop.time,
        coordinates: { lat: 0, lng: 0 }, // In a real app, you'd geocode the address
      })),
    };

    if (transport) {
      updateTransport(transport.id, transportData);
    } else {
      addTransport(transportData);
    }
    onSuccess();
  };

  const handleStudentChange = (studentId: string, checked: boolean) => {
    const current = watchedStudents;
    if (checked) {
      setValue('students', [...current, studentId]);
    } else {
      setValue('students', current.filter(id => id !== studentId));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="routeName">Route Name</Label>
          <Input
            id="routeName"
            {...register('routeName')}
            className={errors.routeName ? 'border-red-500' : ''}
          />
          {errors.routeName && (
            <p className="text-sm text-red-500">{errors.routeName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverName">Driver Name</Label>
          <Input
            id="driverName"
            {...register('driverName')}
            className={errors.driverName ? 'border-red-500' : ''}
          />
          {errors.driverName && (
            <p className="text-sm text-red-500">{errors.driverName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleNumber">Vehicle Number</Label>
          <Input
            id="vehicleNumber"
            {...register('vehicleNumber')}
            className={errors.vehicleNumber ? 'border-red-500' : ''}
          />
          {errors.vehicleNumber && (
            <p className="text-sm text-red-500">{errors.vehicleNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            {...register('capacity', { valueAsNumber: true })}
            className={errors.capacity ? 'border-red-500' : ''}
          />
          {errors.capacity && (
            <p className="text-sm text-red-500">{errors.capacity.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Schedule</Label>
        <Input
          id="schedule"
          placeholder="e.g., 7:00 AM - 8:00 AM, 3:00 PM - 4:00 PM"
          {...register('schedule')}
          className={errors.schedule ? 'border-red-500' : ''}
        />
        {errors.schedule && (
          <p className="text-sm text-red-500">{errors.schedule.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Stops</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendStop({ name: '', address: '', time: '' })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Stop
          </Button>
        </div>
        <div className="space-y-4">
          {stopFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Stop {index + 1}</h4>
                {stopFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeStop(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Stop Name</Label>
                  <Input
                    {...register(`stops.${index}.name` as const)}
                    placeholder="Stop name"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Address</Label>
                  <Input
                    {...register(`stops.${index}.address` as const)}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Time</Label>
                  <Input
                    {...register(`stops.${index}.time` as const)}
                    placeholder="e.g., 7:30 AM"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.stops && (
          <p className="text-sm text-red-500">{errors.stops.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Students</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
          {students.map((student) => (
            <div key={student.id} className="flex items-center space-x-2">
              <Checkbox
                id={`student-${student.id}`}
                checked={watchedStudents.includes(student.id)}
                onCheckedChange={(checked) => handleStudentChange(student.id, checked as boolean)}
              />
              <Label htmlFor={`student-${student.id}`} className="text-sm">
                {student.name} ({student.class})
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {transport ? 'Update Route' : 'Add Route'}
        </Button>
      </div>
    </form>
  );
}