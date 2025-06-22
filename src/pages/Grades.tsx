import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import {
  Plus,
  Search,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GradeForm } from '@/components/forms/GradeForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export function Grades() {
  const { grades, students, subjects } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const availableClasses = [...new Set(students.map(s => s.class))];
  
  const filteredGrades = grades.filter(grade => {
    const student = students.find(s => s.id === grade.studentId);
    const subject = subjects.find(s => s.id === grade.subjectId);
    
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student?.class === classFilter;
    const matchesSubject = subjectFilter === 'all' || grade.subjectId === subjectFilter;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  const handleAdd = () => {
    setSelectedGrade(null);
    setIsFormOpen(true);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  const getGradeColor = (average: number) => {
    if (average >= 90) return 'text-green-600';
    if (average >= 80) return 'text-blue-600';
    if (average >= 70) return 'text-yellow-600';
    if (average >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (average: number) => {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage student grades and academic performance
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Grade</DialogTitle>
              <DialogDescription>
                Record grades for a student in a specific subject
              </DialogDescription>
            </DialogHeader>
            <GradeForm
              grade={selectedGrade}
              onSuccess={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Grades
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {grades.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Grade
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {grades.length > 0 
                    ? (grades.reduce((sum, grade) => sum + grade.average, 0) / grades.length).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  A Grades
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {grades.filter(g => g.average >= 90).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Below Average
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {grades.filter(g => g.average < 70).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student or subject name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {availableClasses.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Records</CardTitle>
          <CardDescription>
            Complete academic performance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead>Participation</TableHead>
                <TableHead>Average</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">
                    {getStudentName(grade.studentId)}
                  </TableCell>
                  <TableCell>{getSubjectName(grade.subjectId)}</TableCell>
                  <TableCell>{grade.semester}</TableCell>
                  <TableCell>
                    {grade.grades.assignments.length > 0 
                      ? (grade.grades.assignments.reduce((a, b) => a + b, 0) / grade.grades.assignments.length).toFixed(1)
                      : 'N/A'
                    }%
                  </TableCell>
                  <TableCell>
                    {grade.grades.exams.length > 0 
                      ? (grade.grades.exams.reduce((a, b) => a + b, 0) / grade.grades.exams.length).toFixed(1)
                      : 'N/A'
                    }%
                  </TableCell>
                  <TableCell>{grade.grades.participation}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getGradeColor(grade.average)}`}>
                        {grade.average.toFixed(1)}%
                      </span>
                      <Progress value={grade.average} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={grade.average >= 70 ? 'default' : 'destructive'}
                      className={getGradeColor(grade.average)}
                    >
                      {getGradeLetter(grade.average)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No grades found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || classFilter !== 'all' || subjectFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Add your first grade record to get started'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}