import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'

import './styles.css'
import { Link, useHistory } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi'

import logo from '../../assets/logo.svg'

import { Map, TileLayer, Marker } from 'react-leaflet'

import api from '../../services/api'

import { LeafletMouseEvent } from 'leaflet'

import axios from 'axios'
interface Item {
  id: number,
  title: string,
  img_url: string,
}
interface IBGEUFResponse {
  sigla: string
}
interface IBGECityResponse {
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const [citiesNames, setCities] = useState<string[]>([])
  const [selectedPosition, setselectedPosition] = useState<[number, number]>([0, 0])

  const [selectedUf, setSelectedUF] = useState('0')
  const [selectedCity, setselectedCity] = useState('0')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const history = useHistory()
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setInitialPosition([
        position.coords.latitude,
        position.coords.longitude
      ])
    })
  }, [])
  useEffect(() => {
    api.get('items').then(res => {
      setItems(res.data);

    })
  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const ufInitials = res.data.map(uf => {
        return uf.sigla
      })
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '') return;
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
      const cities = res.data.map(city => {
        return city.nome
      })
      setCities(cities)
    })
  }, [selectedUf])



  function handleSelectdedUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUF(uf)
  }
  function handleSelectdedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setselectedCity(city)
  }
  function handleMapClick(event: LeafletMouseEvent) {
    setselectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value })
  }

  function handleSelectedItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item === id)
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }

  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;


    const data = {
      name, email, whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }
    await api.post('points', data)
    history.push('/')
  }
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>
              Dados
            </h2></legend>


          <div className="field">
            <label htmlFor="name">Nome da entidade:</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail:</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp:</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
            </div>
          </div>


        </fieldset>

        <fieldset>
          <legend>
            <h2>
              Endereço
            </h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onclick={handleMapClick}>

            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectdedUF}>

                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => {
                  return (
                    <option key={uf} value={uf}>{uf}</option>
                  )
                })}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>

              <select name="city" id="city" value={selectedCity} onChange={handleSelectdedCity}>

                <option value="0">Selecione uma cidade</option>
                {citiesNames.map(city => {
                  return (
                    <option key={city} value={city}>{city}</option>
                  )
                })}
              </select>
            </div>

          </div>




        </fieldset>


        <fieldset>
          <legend>
            <h2>
              Ítens de coleta
            </h2>
            <span>Selecione um ou mais itens abaixo</span>

          </legend>
          <ul className="items-grid">

            {items.map(item => {
              return (
                <li key={item.id} onClick={() => handleSelectedItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}>
                  <img src={item.img_url} alt="" />
                  <span>{item.title}</span>
                </li>
              )
            })}



          </ul>
        </fieldset>

        <button type='submit'>
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}
export default CreatePoint