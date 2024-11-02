import React, { useState } from "react";
import CustomTable from '../components/CustomTable';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message, Modal, Form, Input } from "antd";

function Home() {
    const HTTP = import.meta.env.VITE_API;
    const queryClient = useQueryClient();
    const [editingStudent, setEditingStudent] = useState(null);
    const [form] = Form.useForm();

    message.config({
        top: 80, 
        duration: 3,
        maxCount: 1,
    });

    const getAllStudents = async () => {
        const response = await axios.get(`${HTTP}/students`);
        return response.data.map((item, index) => ({
            ...item,
            key: index + 1,
        }));
    };

    const { data: studentsData = [] } = useQuery({
        queryKey: ["students"],
        queryFn: getAllStudents,
    });

    const deleteStudent = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${HTTP}/students/${id}`);
        },
        onSuccess: () => {
            message.success("Student o'chirildi");
            queryClient.invalidateQueries(["students"]);
        },
        onError: () => {
            message.error("Studentni o'chirishda xatolik yuz berdi");
        },
    });

    const editStudent = (record) => {
        setEditingStudent(record);
        form.setFieldsValue({
            name: record.name,
            surname: record.surname,
            age: record.age,
        });
    };

    const handleCancel = () => {
        setEditingStudent(null);
    };

    const handleEditSubmit = async (values) => {
        try {
            await axios.put(`${HTTP}/students/${editingStudent.id}`, values);
            message.success("Student tahrirlandi");
            queryClient.invalidateQueries(["students"]);
            handleCancel();
        } catch (error) {
            message.error("Studentni yangilashda xatolik yuz berdi");
        }
    };

    return (
        <div className="p-5">
            <CustomTable 
                data={studentsData} 
                onDelete={(record) => deleteStudent.mutate(record.id)} 
                onEdit={editStudent} 
            />
            <Modal
                title="Studentni tahrirlash"
                open={!!editingStudent}
                onCancel={handleCancel}
                footer={null}
                className="rounded-lg"
            >
                <Form form={form} onFinish={handleEditSubmit} layout="vertical">
                    <Form.Item 
                        name="name" 
                        label="Name" 
                        rules={[{ required: true, message: 'Iltimos, ismni kiriting!' }]}
                    >
                        <Input className="border border-gray-300 rounded-md p-2" />
                    </Form.Item>
                    <Form.Item 
                        name="surname" 
                        label="Surname" 
                        rules={[{ required: true, message: 'Iltimos, familiyani kiriting!' }]}
                    >
                        <Input className="border border-gray-300 rounded-md p-2" />
                    </Form.Item>
                    <Form.Item 
                        name="age" 
                        label="Age" 
                        rules={[{ required: true, message: 'Iltimos, yoshni kiriting!' }]}
                    >
                        <Input type="number" className="border border-gray-300 rounded-md p-2" />
                    </Form.Item>
                    <Form.Item>
                        <button type="submit" className="bg-blue-500 text-white w-full rounded-md p-2 hover:bg-blue-600 transition duration-200">
                            Save
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Home;
