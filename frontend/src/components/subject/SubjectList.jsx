import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi";
import { AppURL } from "../../apis/AppURL";
import { getAuthToken } from "./../../utils/loaders/authLoader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const SubjectList = ({ subjects }) => {
  const [subjectList, setSubjectList] = useState(subjects || []);
  const authToken = getAuthToken();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière après cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(AppURL.managesubject(id), {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSubjectList(subjectList.filter((subject) => subject.id !== id));
        toast.success("La matière a été supprimée avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression de la matière :", error);
        Swal.fire(
          "Erreur!",
          "Une erreur est survenue lors de la suppression.",
          "error"
        );
      }
    }
  };

  const columns = [
    { name: "Libellé", options: { filter: false } },
    { name: "Description", options: { filter: false } },

    {
      name: "Actions",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const subjectId = subjectList[tableMeta.rowIndex].id;
          return (
            <div>
              <Link
                to={`/admin/subjects/${subjectId}/edit`}
                className="btn btn-sm btn-primary mr-1"
              >
                <HiOutlinePencilSquare />
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(subjectId)}
              >
                <HiOutlineTrash />
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
  };

  return (
    <div>
      <MUIDataTable
        title={"Liste des matières"}
        data={subjectList.map((subject) => [subject.name, subject.description])}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default SubjectList;
