import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Payment } from '@/types';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  type: z.enum(['tuition', 'transport', 'other']),
  period: z.string().min(1, 'Period is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  status: z.enum(['pending', 'paid', 'overdue']),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  payment?: Payment | null;
  onSuccess: () => void;
}

export function PaymentForm({ payment, onSuccess }: PaymentFormProps) {
  const { addPayment, updatePayment, students } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment ? {
      studentId: payment.studentId,
      amount: payment.amount,
      type: payment.type,
      period: payment.period,
      dueDate: payment.dueDate,
      description: payment.description,
      status: payment.status,
    } : {
      status: 'pending',
      type: 'tuition',
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    if (payment) {
      updatePayment(payment.id, data);
    } else {
      addPayment(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Student</Label>
          <Select
            value={watch('studentId') || ''}
            onValueChange={(value) => setValue('studentId', value)}
          >
            <SelectTrigger className={errors.studentId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.class})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-sm text-red-500">{errors.studentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Payment Type</Label>
          <Select
            value={watch('type')}
            onValueChange={(value) => setValue('type', value as 'tuition' | 'transport' | 'other')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as 'pending' | 'paid' | 'overdue')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Input
            id="period"
            placeholder="e.g., Q1 2024, January 2024"
            {...register('period')}
            className={errors.period ? 'border-red-500' : ''}
          />
          {errors.period && (
            <p className="text-sm text-red-500">{errors.period.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className={errors.dueDate ? 'border-red-500' : ''}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Payment description..."
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {payment ? 'Update Payment' : 'Add Payment'}
        </Button>
      </div>
    </form>
  );
}