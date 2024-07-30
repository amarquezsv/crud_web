import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alert(msj,icon,foco=''){
    onFocus(foco);
    const MySwall = withReactContent(Swal);
    MySwall.fire({
        title:msj,
        icon:icon
    });
}

function onFocus(foco){
    if(foco !== ''){
        document.getElementById(foco).focus();
    }
}