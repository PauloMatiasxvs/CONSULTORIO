import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const schema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  consultationDate: z.date({ required_error: 'Data obrigatória' }),
  value: z.number().min(1, 'Valor obrigatório'),
  paymentMethod: z.enum(['Cartão', 'Dinheiro', 'Pix']),
  returnDate: z.date({ required_error: 'Data de retorno obrigatória' }),
});

export default function PatientForm() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const { register, handleSubmit, setValue, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        const { data } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single();
        setPatient(data);
        setValue('name', data.name);
        setValue('consultationDate', dayjs(data.consultation_date));
        setValue('value', data.value);
        setValue('paymentMethod', data.payment_method);
        setValue('returnDate', dayjs(data.return_date));
      };
      fetchPatient();
    }
  }, [id]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      consultation_date: data.consultationDate.toDate(),
      value: parseFloat(data.value),
      payment_method: data.paymentMethod,
      return_date: data.returnDate.toDate(),
    };

    if (id) {
      await supabase.from('patients').update(payload).eq('id', id);
    } else {
      await supabase.from('patients').insert([payload]);
    }

    toast.success('Operação realizada!');
    reset();
    navigate('/dashboard');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <input
          {...register('name')}
          placeholder="Nome do Paciente"
          className="w-full p-3 mb-4 border rounded"
        />
        <DatePicker
          label="Data Consulta"
          value={patient?.consultation_date}
          onChange={(date) => setValue('consultationDate', date)}
          slotProps={{ textField: { fullWidth: true, className: 'mb-4' } }}
        />
        <input
          {...register('value', { valueAsNumber: true })}
          type="number"
          placeholder="Valor da Consulta"
          className="w-full p-3 mb-4 border rounded"
        />
        <select
          {...register('paymentMethod')}
          className="w-full p-3 mb-4 border rounded"
        >
          <option value="">Selecione</option>
          <option value="Cartão">Cartão</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
        </select>
        <DatePicker
          label="Data Retorno"
          value={patient?.return_date}
          onChange={(date) => setValue('returnDate', date)}
          slotProps={{ textField: { fullWidth: true, className: 'mb-4' } }}
        />
        <button
          type="submit"
          className="w-full p-3 text-white bg-green-500 rounded hover:bg-green-600"
        >
          {id ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>
      <ToastContainer />
    </LocalizationProvider>
  );
}