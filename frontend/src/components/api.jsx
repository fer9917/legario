import { IonCard, IonCardTitle, IonIcon, IonItem } from '@ionic/react';
import { sadOutline } from 'ionicons/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';

export const Alert = (message = 'Ocurrió un error') => {
	toast.dismiss();

	toast.info(message, {
      toastId: 'alert'
    });
}

const loading = (status) => {
	if (status === 'show') {
		toast.loading("Cargando...")
	} else {
		toast.dismiss();
	}
}

export const api = async (data = {}) => {
	// Loading
	loading('show')

	try {
		// Validations
		if (!data.url) throw new Error("url required")
		if (!data.type) data.type = 'get'
		// Get token
		let token = ''
		const local_user = localStorage.getItem("_user")
		if (local_user) {
			const user = JSON.parse(local_user)
			token = user.token
		}

		const type = data.type
		const url = data.url
		delete data.type
		delete data.url
		let request = {
			url: process.env.REACT_APP_URL + url,
			timeout: 8000,
			method: type,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Authorization': `Bearer ${token}`
			}
		}
	
		if (type === 'get') {
			request.params = data
		} else {
			request.data = data
		}
		
		console.log('request', request)

		let res = await axios(request)

		// Loading
		loading('hide')

		// Error
		if (res.status !== 200) {
			console.error(res);
			throw new Error("Error api")
		}

		// Resp
		return res.data
	} catch (err) {
		console.error(err);

		// Loading
		loading('hide')

		throw new Error("Error api")
	}
}

export const NoData = () => {
	return (
		<IonCard>
			<IonItem>
				<IonIcon
					icon={sadOutline}
					color="secondary"
					slot="start" />
				<IonCardTitle>Sin información</IonCardTitle>
			</IonItem>
		</IonCard>
	);
}