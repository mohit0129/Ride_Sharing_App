import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";

export const roleStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
    },
    header : {
        
        // borderBottomRightRadius : 100,
        // borderBottomLeftRadius : 100,
        // marginBottom : 40,
        paddingVertical : 20,
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center',
        // shadowColor : Colors.primary,
        // shadowOffset : {height : 10, width : 10},
        // shadowOpacity : 0.7,
        // shadowRadius : 10,
        // elevation : 10
    },
    logo: {
        resizeMode: 'contain',
        height: 60,
    },
    card: {
        width: '90%',
        marginTop:40,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: '#333',
        alignItems: 'center',
    },
    cardContent: {
        width: '100%',
        padding: 10,
    },
    title: {
        fontSize: 18,
        color: '#fff',
    },
    image: {
        height: 120,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        width: '100%',
    },
    description: {
        fontSize: 14,
        color: '#999',
    },
    roleContainer : {
        backgroundColor : '#111',
        width : '100%',
        flex : 1,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
        justifyContent : 'flex-start',
        alignItems : 'center',
        paddingTop : 30,
    },
    footer : {
        color : '#fff',
        width : '85%',
        alignSelf : 'flex-end',
        paddingTop : 40,
        paddingRight : 20,
        opacity : 0.3,
        textAlign : 'right',
        paddingBottom : 10
    }
})