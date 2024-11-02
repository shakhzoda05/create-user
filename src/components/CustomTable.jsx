import React from 'react';
import { Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";

function CustomTable({ data, onDelete, onEdit }) {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Surname',
            dataIndex: 'surname',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <MoreOutlined className="cursor-pointer" />
                    <EditOutlined onClick={() => onEdit(record)} className="cursor-pointer" />
                    <DeleteOutlined onClick={() => onDelete(record)} className="cursor-pointer" />
                </Space>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={data} />
    );
}

export default CustomTable;
