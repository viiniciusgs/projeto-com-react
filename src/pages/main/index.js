import React, { Component } from 'react';

import api from '../../services/api';

import Header from '../../components/Header';

import Pagination from '@material-ui/lab/Pagination';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';

import './styles.css';

export default class Main extends Component {
    state = {
        photos: [],
        page: 1,
        value: '',
        searchPhoto: null
    }

    componentDidMount() {
        this.loadPhotos();
    }

    loadPhotos = async (page = 1) => {
        const response = await api.get(`/photos?_start=${(page * 10) - 10}&_limit=10`);

        this.setState({ photos: response.data, page });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if(this.state.value !== '') {
            const response = await api.get(`/photos/${this.state.value}`);

            this.setState({ searchPhoto: response.data });
        }
    }

    favorites = (id) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = favorites.indexOf(id);

        if(index === -1) {
            favorites.push(id);
        } else {
            favorites.splice(index, 1);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    prevPage = () => {
        const { page } = this.state;

        if(page === 1) return;

        const pageNumber = page - 1;

        this.loadPhotos(pageNumber);
    }    

    nextPage = () => {
        const { photos, page } = this.state;

        if(page === photos.length) return;

        const pageNumber = page + 1;

        this.loadPhotos(pageNumber);
    }

    render() {
        const { photos, searchPhoto } = this.state;

        if(searchPhoto) {
            return(
                <div className="photos-list">
                <Header />

                <main id="main">
                    <div className="search">
                        <form onSubmit={this.handleSubmit}>
                            <button className="searchByCode">
                                <AiOutlineSearch size={20} color="dodgerblue" />
                            </button>

                            <input type="number" value={this.state.value} placeholder="Procurar por ID" onChange={event => this.setState({ value: event.target.value })} />

                            <button className="clearSearch" onClick={() => {
                                this.setState({ searchPhoto: null, value: '' });
                                this.loadPhotos();
                            }}>
                                <MdClear size={20} color="#aaaaaa" />
                            </button>
                        </form>
                    </div>
        
                    <div className="content">
                        <article key={searchPhoto.id}>
                            <img src={searchPhoto.url} alt={searchPhoto.title}></img>
                            <div className="description">
                                <strong>ID do Álbum: <p>{searchPhoto.albumId}</p></strong>
                                <strong>ID da Foto: <p>{searchPhoto.id}</p></strong>
                                <h1>{searchPhoto.title}</h1>
                            </div>
                        </article>

                        <button onClick={() => this.favorites(searchPhoto.id)}>Favoritar</button>
                    </div>
                </main>
                </div>
            );
        }

        return (
            <div className="photos-list">
                <Header />

                <main id="main">
                    <div className="search">
                        <form onSubmit={this.handleSubmit}>
                            <button className="searchByCode">
                                <AiOutlineSearch size={20} color="dodgerblue" />
                            </button>

                            <input type="number" value={this.state.value} placeholder="Procurar por ID" onChange={event => this.setState({ value: event.target.value })} />
                        </form>
                    </div>
            
                    {photos.map(photo => {
                        return(
                            <div className="content">
                                <article key={photo.id}>
                                    <img src={photo.url} alt={photo.title}></img>
                                    <div className="description">
                                        <div className="idS">
                                            <img src={photo.thumbnailUrl} alt={photo.title}></img>
                                            <strong>ID do Álbum: <p>{photo.albumId}</p></strong>
                                            <strong>ID da Foto: <p>{photo.id}</p></strong>
                                        </div>
                                        
                                        <h1>{photo.title}</h1>
                                    </div>
                                </article>

                                <button onClick={() => this.favorites(photo.id)}>Favoritar</button>
                            </div>
                        );
                    })}
    
                    <div className="actions">
                        <div className="pagination">
                            <Pagination count={10} color='primary' variant="outlined" shape="rounded" onChange={(event, page) => {
                                this.loadPhotos(page);
                            }} />
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
