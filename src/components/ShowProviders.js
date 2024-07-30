import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../funtions';

const ShowProviders = () => {
    const url = 'http://127.0.0.1:8000/providers/'
    const [providers, setProviders] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [timestamps, setTimestamps] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');


    useEffect(() => {
        getProviders();
    }, []);


    const getProviders = async () => {
        const respont = await axios.get(url);
        setProviders(respont.data);
    }

    const openModal = (op, id, name, address, phone, description) => {
        setId('');
        setName('');
        setAddress('');
        setPhone('');
        setDescription('');
        setOperation(op);
        if (op == 1) {
            setTitle('Create provider')
        }
        else if (op == 2) {
            setTitle('Edit provider')
            setId(id);
            setName(name);
            setAddress(address);
            setPhone(phone);
            setDescription(description);
        }
    }

    const checkV = () => {
        var param;
        var method;
        var urlTran;

        if (name.trim() === '') {
            show_alert('invalid Name', 'warning')
        }
        else if (address.trim() === '') {
            show_alert('invalid address', 'warning')
        }
        else if (phone.trim() === '') {
            show_alert('invalid phone', 'warning')
        }
        else if (description.trim() === '') {
            show_alert('invalid description', 'warning')
        }
        else {
            if (operation === 1) {
                param = { name: name, address: address, phone: phone, description: description };
                method = "POST"
                urlTran = "http://127.0.0.1:8000/providers/create/"
            }
            else if (operation === 2) {
                param = { name: name, address: address, phone: phone, description: description };
                method = "PUT"
                urlTran = "http://127.0.0.1:8000/providers/" + id + "/update/"
            }
            enviarSolicitud(method, param, urlTran);
        }
    }

    const enviarSolicitud = async (method, param, urlTran) => {
        await axios({ method: method, url: urlTran, data: param }).then(function (respont) {
            var typeM = respont.data[0];
            var msk = respont.data[1];
            show_alert(msk, typeM);
            if (typeM === 'success') {
                document.getElementById('btnCerrar').click();
                getProviders();
            }
        })
            .catch(function (error) {
                show_alert("Error", 'error');
                console.log(error);
            });
    }


    const deleteProviders = (id, name) => {
        const MySwall = withReactContent(Swal);
        MySwall.fire({
            title:"Delete" + name + "?",
            icon:'question',
            text: 'are you sure?',
            showCancelButton:true,
            confirmButtonText:'Yes, Delete',
            cancelButtonText:'Cancel'
        }).then((result) =>{
            if(result.isConfirmed){
                enviarSolicitud("DELETE", id, "http://127.0.0.1:8000/providers/" + id + "/delete/");

            } else {
                show_alert("Cancel", 'info');
            }
        }) ;
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <label className='h4'>CRUD Providers</label>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">ID</th>
                                        <th scope="col">name</th>
                                        <th scope="col">address</th>
                                        <th scope="col">phone</th>
                                        <th scope="col">description</th>
                                        <th scope="col">timestamps</th>
                                        <th scope="col">
                                            <button className='btn btn-primary' onClick={() => openModal(1)} data-bs-toggle="modal" data-bs-target='#modalProviders'>
                                                <i className='fa-solid fa-circle-plus'></i> Add
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.map((provider, i) => (

                                        <tr key={provider.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{provider.id}</td>
                                            <td>{provider.name}</td>
                                            <td>{provider.address}</td>
                                            <td>{provider.phone}</td>
                                            <td>{provider.description}</td>
                                            <td>{provider.timestamps}</td>
                                            <td>
                                                <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProviders' onClick={() => openModal(2, provider.id, provider.name, provider.address, provider.phone, provider.description)} >
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                <button className='btn btn-danger' onClick={() => deleteProviders(provider.id,provider.name)}>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id='modalProviders' className='modal fade' aria-hidden='true' >
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h4'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='name' className='form-control' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='address' className='form-control' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='phone' className='form-control' placeholder='phone' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='description' className='form-control' placeholder='description' value={description} onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button className='btn btn-success' onClick={() => checkV()}>
                                    <i className='fa-solid fa-floppy-disk'></i>
                                </button>
                            </div>

                        </div>

                        <div className='modal-footer'>
                            <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ShowProviders
