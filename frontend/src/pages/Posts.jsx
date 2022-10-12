import { useState, useEffect, useCallback } from 'react';
import {
	IonCard,
	IonLabel,
	IonTitle,
	IonHeader,
	IonToolbar,
	IonCardContent,
	IonSearchbar,
	IonModal,
	IonItem,
	IonContent,
	IonCardHeader,
	IonCardSubtitle,
	IonButtons,
	IonButton,
	IonSelect,
	IonSelectOption,
	IonInput,
} from '@ionic/react';

import { Alert, api, NoData } from '../components/api';
import PostComments from './PostComments';

const Posts = () => {
	/* Hooks
	======================================== */
	const [disabled, setDisabled] = useState(false)
	const [allPosts, setAllPosts] = useState(null)
	const [verPost, setVerPost] = useState(false);
	const [buscar, setBuscar] = useState('')
	const [posts, setPosts] = useState(null)
	const [user, setUser] = useState(null)
	const [filters, setFilters] = useState({
		date_init: '',
		date_end: '',
		status: '',
	})
	const [post, setPost] = useState({
		content: '',
		user_id: '',
		status: '',
		date: '',
		id: '',
	})

	/* Funciones
	======================================== */
	// Get post desde API
	const getPosts = useCallback(() => {
		console.log('getPosts')

		// Get local posts
		const string_posts = localStorage.getItem("_posts")
		if (string_posts) {
			const local_posts = JSON.parse(string_posts)

			setAllPosts(local_posts)
			setPosts(local_posts)

			return
		}

		// Get posts desde API
		api({
			url: 'posts',
		}).then((resp) => {
			console.log('resp', resp);

			// Set posts
			if (resp.length > 0) {
				setAllPosts(resp)
				setPosts(resp)

				// Sve posts on local
				localStorage.setItem("_posts", JSON.stringify(resp));
			}
		}).catch((err) => {
			Alert("Ocurrió un error, revisa la información." + err)
		})
	}, [])

	// Get filtre post from API
	const filterPosts = () => {
		console.log('filterPosts')

		// Loading
		setDisabled(true)

		api({
			...filters,
			url: 'posts',
		}).then((resp) => {
			console.log('resp', resp);

			// Loading
			setDisabled(false)

			// Set posts
			setAllPosts(resp)
			setPosts(resp)

			// Sve posts on local
			localStorage.setItem("_posts", JSON.stringify(resp));

			// Scroll to posts
			const toScroll = document.querySelector( '#toScroll' );
  			toScroll.scrollIntoView( { behavior: 'smooth', block: 'start' } );
		}).catch((err) => {
			console.error('err', err);

			// Loading
			setDisabled(false)

			Alert("Ocurrió un error, revisa la información." + err)
		})
	}

	// Filter post by title or content
	const searchPosts = (e) => {
		const search = e.detail.value

		setBuscar(search)

		// Clean search
		if (search === '') {
			setPosts(allPosts)

			return
		}

		// Filtra los posts
		const _posts = allPosts.filter((post) => {
			if (post.content.toLowerCase().includes(search.toLowerCase())) return true
			if (post.title.toLowerCase().includes(search.toLowerCase())) return true

			// Not match
			return false
		})
		setPosts(_posts)
	}

	// Function that ejecute when the user write an input
	const updateFilters = (e) => {
		setFilters({
			...filters,
			[e.target.name]: e.target.value
		});
	}


	const createPost = () => {
		window.location.replace("/addPost")
	}

	const editPost = (post) =>{
		console.log('editPost', post)
		
		localStorage.setItem("_post", JSON.stringify(post));

		window.location.replace("/addPost")
	}

	const deletePost = (id) =>{
		console.log('deletePost', id)

		if (!window.confirm("¿Eliminar entrada?")) return

		api({
			url: 'posts/'+id,
			type: 'delete'
		}).then((resp) => {
			console.log('resp', resp);

			Alert("Entrada eliminada")

			filterPosts()
		}).catch((err) => {
			console.error('err', err);

			// Loading
			setDisabled(false)

			Alert("Ocurrió un error, revisa la información." + err)
		})
	}

	// Show post comments
	const showComments = (post) => {
		setPost(post)
		setVerPost(true)
	}

	// Get user from local
	const getUser = () =>{
		console.log('getUser')

		const local_user = localStorage.getItem("_user")
		if (local_user) {
			const json_user = JSON.parse(local_user)

			setUser(json_user)
		}else{
			window.location.replace("/login")
		}
	}

	// Clean user data
	const logout = () =>{
		console.log('logout')

		if (!window.confirm("¿Cerrar sesión?")) return

		localStorage.removeItem("_user")

		window.location.replace("/login")
	}
	

	/* Observers
	======================================== */
	useEffect(() => {
		if (!posts) getPosts()
		if (!user) getUser()
	}, [posts, getPosts, user, getUser])

	return (<IonContent>
		
		{!user ? <></>:<>
			{user.type === 0 ? <></>:
				<IonCard>
					<IonCardHeader>
						<IonCardSubtitle>Buscar entrada</IonCardSubtitle>
					</IonCardHeader>
					<IonCardContent>
						<IonItem>
							<IonLabel>Estado</IonLabel>
							<IonSelect
								onIonChange={e => updateFilters(e)}
								value={filters.status}
								placeholder="Estado"
								required={true}
								name="status"
							>
								<IonSelectOption value={''}>Todas</IonSelectOption>
								<IonSelectOption value={0}>Pendiente</IonSelectOption>
								<IonSelectOption value={1}>Aprobada</IonSelectOption>
								<IonSelectOption value={2}>Rechazada</IonSelectOption>
							</IonSelect>
						</IonItem>
						<IonItem>
							<IonLabel>Inicio</IonLabel>
							<IonInput
								onIonChange={e => updateFilters(e)}
								value={filters.date_init}
								placeholder="Inicio"
								name="date_init"
								min="2022-10-11"
								type="date"
							/>
						</IonItem>
						<IonItem>
							<IonLabel>Fin</IonLabel>
							<IonInput
								onIonChange={e => updateFilters(e)}
								value={filters.date_end}
								placeholder="Inicio"
								name="date_end"
								min="2022-10-11"
								type="date"
							/>
						</IonItem><br />
						<IonButton expand="block" disabled={disabled} onClick={() => filterPosts()}>Filtrar</IonButton>
					</IonCardContent>
				</IonCard>
			}
		</>}
		
		<IonCard id="toScroll">
			<IonCardContent style={{ textAlign: 'left' }}>
				<IonButton expand="block" onClick={() => createPost()}>Crear nueva entrada</IonButton>
			</IonCardContent>
		</IonCard>
		{!posts ? <NoData /> :<>
			{posts.length === 0 ? <NoData /> :<>
				<IonModal isOpen={verPost} onWillDismiss={() => setVerPost(false)}>
					<IonHeader>
						<IonToolbar>
							<IonTitle>Comentarios</IonTitle>
							<IonButtons slot="end">
								<IonButton onClick={() => setVerPost(false)}>X</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<IonCard>
						<IonCardContent style={{ textAlign: 'left' }}>
							<PostComments post_id={post.id} />
						</IonCardContent>
					</IonCard>
				</IonModal>
				<IonSearchbar
					onIonChange={e => searchPosts(e)}
					placeholder="Buscar"
					animated={true}
					value={buscar}
				>
				</IonSearchbar>
				{posts.map((value, key) => {
					let status = ''
					switch (value.status) {
						case 0:
							status = 'Pendiente'
							break;
						case 1:
							status = 'Aprobada'
							break;
						case 2:
							status = 'Rechazada'
							break;
					
						default:
							break;
					}

					let edit = ''
					if (user) {
						if (user.type === 1) edit = <IonButton expand="block" onClick={() => editPost(value)}>Editar</IonButton>
					}

					return (
						<IonCard key={'post_'+key}>
							<IonCardHeader>
								<IonCardSubtitle>{value.title} | <small>{value.date}</small></IonCardSubtitle>
							</IonCardHeader>
							<IonCardContent style={{ textAlign: 'left' }}>
								<IonLabel>{value.content}</IonLabel><br /><br />
								<IonLabel>Status: {status}</IonLabel><br /><br />
								<IonButton expand="block" color="secondary" onClick={() => showComments(value)}>Comentarios</IonButton>
								{edit}
								<IonButton expand="block" color="danger" onClick={() => deletePost(value.id)}>Eliminar</IonButton>
							</IonCardContent>
						</IonCard>
					)
				})}
				<IonCard>
					<IonCardContent style={{ textAlign: 'left' }}>
						<IonButton expand="block" onClick={() => createPost()}>Crear nueva entrada</IonButton>
					</IonCardContent>
				</IonCard>
			</>}
		</>}
		{!user ? <></>:
			<IonCard>
				<IonCardContent style={{ textAlign: 'left' }}>
					<IonButton expand="block" color="danger" onClick={() => logout()}>Cerrar sesión</IonButton>
				</IonCardContent>
			</IonCard>
		}
	</IonContent>);
};

export default Posts;