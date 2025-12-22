<script>
    export default{
        name:'ProfileHeader'
    }
    </script>
    <template>
        <div class="profile__header--section">
            <div class="row">
                <div class="col-4">
                    <div class="gear-icon__container">
                        <i class="bi bi-gear"></i>
                    </div>
                </div>
                <div class="col-4">
                    <div class="username__container">
                        <p class="text-center">
                            user__.name
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <style scoped>
        .profile__header--section{
            /* position: fixed;
            top: 0%; */
            width: 100%;
            background-color: rgba(255, 255, 255, 0);
        }
        .gear-icon__container{
            /* color:white; */
            color: rgb(255, 222, 179);
            font-size: 2rem;
            width: 100%;
  transform: translateX(10px);

        }
        .username__container p{
  color: rgb(255, 222, 179);
            font-size: 1.5rem;
            width: 100%;
        }
        /* .gear-icon__container i {
  transform: translateX(10px);
} */


    </style>