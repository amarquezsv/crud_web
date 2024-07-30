import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../funtions';

const ShowProducts = () => {
    const url = 'http://127.0.0.1:8000/products/'
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [barcode, setBarcode] = useState('');
    const [timestamps, setTimestamps] = useState('');
    const [provider, setProvider] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');


    useEffect(() => {
        getProducts();
    }, []);


    const getProducts = async () => {
        const respont = await axios.get(url);
        setProducts(respont.data);
    }

    const openModal = (op, id, name, price, description, barcode,provider) => {
        setId('');
        setName('');
        setPrice('');
        setDescription('');
        setBarcode('');
        setProvider('');

        setOperation(op);
        if (op == 1) {
            setTitle('Create Product')
        }
        else if (op == 2) {
            setTitle('Edit Product')
            setId(id);
            setName(name);
            setPrice(price);
            setDescription(description);
            setBarcode(barcode);
            setProvider(provider);
        }
    }

    const checkV = () => {
        var param;
        var method;
        var urlTran;

        if (name.trim() === '') {
            show_alert('invalid Name', 'warning')
        }
        else if (price === '') {
            show_alert('invalid price', 'warning')
        }
        else if (description.trim() === '') {
            show_alert('invalid description', 'warning')
        }
        else if (barcode.trim() === '') {
            show_alert('invalid barcode', 'warning')
        }
        else if (provider === '') {
            show_alert('invalid provider', 'warning')
        }
        else {
            if (operation === 1) {
                param = { name: name, price: price, description: description, barcode: barcode , provider: provider };
                method = "POST"
                urlTran = "http://127.0.0.1:8000/products/create/"
            }
            else if (operation === 2) {
                param = { name: name, price: price, description: description, barcode: barcode , provider: provider };
                method = "PUT"
                urlTran = "http://127.0.0.1:8000/products/" + id + "/update/"
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
                getProducts();
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
            title: "Delete" + name + "?",
            icon: 'question',
            text: 'are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarSolicitud("DELETE", id, "http://127.0.0.1:8000/products/" + id + "/delete/");

            } else {
                show_alert("Cancel", 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <label className='h4'>CRUD Products</label>
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
                                        <th scope="col">price</th>
                                        <th scope="col">description</th>
                                        <th scope="col">barcode</th>
                                        <th scope="col">timestamps</th>
                                        <th scope="col">provider</th>
                                        <th scope="col">
                                            <button className='btn btn-primary' onClick={() => openModal(1)} data-bs-toggle="modal" data-bs-target='#modalProducts'>
                                                <i className='fa-solid fa-circle-plus'></i> Add
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, i) => (

                                        <tr key={product.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.description}</td>
                                            <td>{product.barcode}</td>
                                            <td>{product.timestamps}</td>
                                            <td>{product.provider}</td>
                                            <td>
                                                <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts' onClick={() => openModal(2, product.id, product.name, product.price, product.description, product.barcode, product.provider)} >
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                <button className='btn btn-danger' onClick={() => deleteProviders(product.id, product.name)}>
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

            <div id='modalProducts' className='modal fade' aria-hidden='true' >
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
                                <input type='text' id='price' className='form-control' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='description' className='form-control' placeholder='description' value={description} onChange={(e) => setDescription(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='barcode' className='form-control' placeholder='barcode' value={barcode} onChange={(e) => setBarcode(e.target.value)}></input>
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-sol fa-pe-0'></i> </span>
                                <input type='text' id='provider' className='form-control' placeholder='provider' value={provider} onChange={(e) => setProvider(e.target.value)}></input>
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

export default ShowProducts
